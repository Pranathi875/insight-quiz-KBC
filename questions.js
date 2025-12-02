// API Keys - Replace with your actual keys
const OPENAI_API_KEYS = [
    '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',
    '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'
];
const GEMINI_API_KEY = 'AIzaSyCl3nhI2r-GRr8obAh4deQKhDUFqw3ueH4';


// Function to generate question using AI APIs
async function generateQuestion(levelIndex) {
    const level = [1000, 2000, 3000, 5000, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1250000, 2500000, 5000000, 70000000][levelIndex];
    const difficulty = 'level_' + levelIndex; // Unique difficulty per level for progressive increase
    const uniqueId = Math.random().toString(36).substring(2, 15); // Unique ID for each call
    const timestamp = Date.now(); // Timestamp for additional uniqueness

    const prompt = `Generate a completely unique multiple-choice question for a quiz game like Kaun Banega Crorepati at level ${level} (difficulty: ${difficulty}). Unique ID: ${uniqueId}, Timestamp: ${timestamp}.
    Provide in JSON format: {"question": "string", "options": ["A. option1", "B. option2", "C. option3", "D. option4"], "answer": "A/B/C/D", "category": "string", "hint": "string", "link": "wikipedia link"}.
    Ensure the question is unique, not repeating common ones, and increases in toughness exponentially with higher money amounts, exactly like real KBC where difficulty ramps up sharply after each safe haven. Generate new questions each time we play, ensuring no repetition across game sessions. For level_0 to level_2: very basic general knowledge. For level_3 to level_5: easy general knowledge. For level_6 to level_8: medium, requiring some thought. For level_9 to level_11: hard, niche topics. For level_12 to level_14: expert, advanced concepts, obscure facts, interdisciplinary knowledge. Each level must be noticeably tougher than the previous. Avoid questions about India, geography, history, or basic science if possible for variety. Make options plausible but only one correct.`;

    try {
        // Use OpenAI for all levels
        console.log('Using OpenAI for level', levelIndex, 'with unique ID:', uniqueId);
        const apiKey = OPENAI_API_KEYS[Math.floor(Math.random() * OPENAI_API_KEYS.length)]; // Rotate keys for load balancing
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 300
            })
        });
        const data = await response.json();
        console.log('OpenAI response status:', response.status);
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${data.error?.message || 'Unknown error'}`);
        }
        const content = data.choices[0].message.content;
        console.log('OpenAI content:', content);
        return JSON.parse(content);
    } catch (error) {
        console.error('API call failed for level', levelIndex, ':', error);
        // Return a random static fallback question with offset for variety
        const staticFallbacks = [
            {
                question: "What is 2 + 2?",
                options: ["A. 3", "B. 4", "C. 5", "D. 6"],
                answer: "B",
                category: "Math",
                hint: "Basic addition",
                link: "https://en.wikipedia.org/wiki/Addition"
            },
            {
                question: "What color is the sky on a clear day?",
                options: ["A. Red", "B. Blue", "C. Green", "D. Yellow"],
                answer: "B",
                category: "Science",
                hint: "Scattering of light",
                link: "https://en.wikipedia.org/wiki/Sky"
            },
            {
                question: "How many continents are there?",
                options: ["A. 5", "B. 6", "C. 7", "D. 8"],
                answer: "C",
                category: "Geography",
                hint: "Standard count",
                link: "https://en.wikipedia.org/wiki/Continent"
            },
            {
                question: "What is the largest planet in our solar system?",
                options: ["A. Earth", "B. Mars", "C. Jupiter", "D. Saturn"],
                answer: "C",
                category: "Astronomy",
                hint: "Gas giant",
                link: "https://en.wikipedia.org/wiki/Jupiter"
            },
            {
                question: "Who wrote Romeo and Juliet?",
                options: ["A. Charles Dickens", "B. William Shakespeare", "C. Jane Austen", "D. Mark Twain"],
                answer: "B",
                category: "Literature",
                hint: "English playwright",
                link: "https://en.wikipedia.org/wiki/Romeo_and_Juliet"
            },
            {
                question: "What is the capital of France?",
                options: ["A. London", "B. Berlin", "C. Paris", "D. Rome"],
                answer: "C",
                category: "Geography",
                hint: "City of lights",
                link: "https://en.wikipedia.org/wiki/Paris"
            },
            {
                question: "Which element has the atomic number 1?",
                options: ["A. Helium", "B. Hydrogen", "C. Lithium", "D. Beryllium"],
                answer: "B",
                category: "Chemistry",
                hint: "Lightest element",
                link: "https://en.wikipedia.org/wiki/Hydrogen"
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["A. Vincent van Gogh", "B. Pablo Picasso", "C. Leonardo da Vinci", "D. Michelangelo"],
                answer: "C",
                category: "Art",
                hint: "Renaissance master",
                link: "https://en.wikipedia.org/wiki/Mona_Lisa"
            },
            {
                question: "What is the square root of 16?",
                options: ["A. 2", "B. 3", "C. 4", "D. 5"],
                answer: "C",
                category: "Math",
                hint: "4 times 4",
                link: "https://en.wikipedia.org/wiki/Square_root"
            },
            {
                question: "Which ocean is the largest?",
                options: ["A. Atlantic", "B. Indian", "C. Arctic", "D. Pacific"],
                answer: "D",
                category: "Geography",
                hint: "Covers more area",
                link: "https://en.wikipedia.org/wiki/Pacific_Ocean"
            },
            {
                question: "What is the chemical symbol for water?",
                options: ["A. H2O", "B. CO2", "C. O2", "D. NaCl"],
                answer: "A",
                category: "Chemistry",
                hint: "Two hydrogen, one oxygen",
                link: "https://en.wikipedia.org/wiki/Water"
            },
            {
                question: "Who discovered penicillin?",
                options: ["A. Alexander Fleming", "B. Louis Pasteur", "C. Robert Koch", "D. Edward Jenner"],
                answer: "A",
                category: "Science",
                hint: "Scottish biologist",
                link: "https://en.wikipedia.org/wiki/Alexander_Fleming"
            },
            {
                question: "What is the capital of Japan?",
                options: ["A. Seoul", "B. Beijing", "C. Tokyo", "D. Bangkok"],
                answer: "C",
                category: "Geography",
                hint: "Largest city in Japan",
                link: "https://en.wikipedia.org/wiki/Tokyo"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["A. Venus", "B. Mars", "C. Jupiter", "D. Saturn"],
                answer: "B",
                category: "Astronomy",
                hint: "Named after Roman god of war",
                link: "https://en.wikipedia.org/wiki/Mars"
            },
            {
                question: "Who wrote 'Pride and Prejudice'?",
                options: ["A. Charlotte Bronte", "B. Emily Bronte", "C. Jane Austen", "D. George Eliot"],
                answer: "C",
                category: "Literature",
                hint: "English novelist",
                link: "https://en.wikipedia.org/wiki/Pride_and_Prejudice"
            },
            {
                question: "What is 10 divided by 2?",
                options: ["A. 3", "B. 4", "C. 5", "D. 6"],
                answer: "C",
                category: "Math",
                hint: "Basic division",
                link: "https://en.wikipedia.org/wiki/Division_(mathematics)"
            },
            {
                question: "Which country is known as the Land of the Rising Sun?",
                options: ["A. China", "B. South Korea", "C. Japan", "D. Thailand"],
                answer: "C",
                category: "Geography",
                hint: "Island nation in Asia",
                link: "https://en.wikipedia.org/wiki/Japan"
            },
            {
                question: "What is the boiling point of water at sea level?",
                options: ["A. 90°C", "B. 100°C", "C. 110°C", "D. 120°C"],
                answer: "B",
                category: "Science",
                hint: "Standard temperature",
                link: "https://en.wikipedia.org/wiki/Boiling_point"
            },
            {
                question: "Who was the first man to walk on the moon?",
                options: ["A. Yuri Gagarin", "B. Buzz Aldrin", "C. Neil Armstrong", "D. John Glenn"],
                answer: "C",
                category: "History",
                hint: "Apollo 11 mission",
                link: "https://en.wikipedia.org/wiki/Neil_Armstrong"
            },
            {
                question: "What is the currency of the United Kingdom?",
                options: ["A. Euro", "B. Pound Sterling", "C. Dollar", "D. Yen"],
                answer: "B",
                category: "Economics",
                hint: "British currency",
                link: "https://en.wikipedia.org/wiki/Pound_sterling"
            }
        ];
        // Shuffle the array and add random offset for more variety
        const shuffled = staticFallbacks.sort(() => 0.5 - Math.random());
        const offset = Math.floor(Math.random() * shuffled.length);
        return shuffled[(levelIndex + offset) % shuffled.length];
    }
}
