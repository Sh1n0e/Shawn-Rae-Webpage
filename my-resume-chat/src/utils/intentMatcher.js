import resumeData from '../data/content-modeling.json';

// Escape a string for use inside a RegExp (prevents single-letter skill matches like 'c' matching inside 'docker')
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


export const matchIntent = (userInput) => {
    const input = userInput.toLowerCase();

    // intent matching for skills
    // NOTE: exclude queries that ask about 'skill level' or 'confidence' so they get handled by the confidence intent
    if ((input.includes('skill') || input.includes('skills') || input.includes('technology') || input.includes('tools'))
        && !(input.includes('skill level') || input.includes('level') || input.includes('confidence') || input.includes('proficiency') || input.includes('proficient') || input.includes('how good') || input.includes('rate'))) {
        return {
            intent:'skills',
            response: formatSkills(resumeData.skills)
        };
    }

    // intent matching for projects
    if(input.includes('project') || input.includes('portfolio') || input.includes('work')) {
        return {
            intent: 'projects',
            response: formatProjects(resumeData.projects)
        };
    }

    // intent matching about section
    if(input.includes('about') || input.includes('who are you') || input.includes('tell me')) {
        return {
            intent: 'about',
            response: resumeData.about.short
        }
    }

    // intent matching for confidence ratings
    if (input.includes('confidence') || input.includes('proficiency') || input.includes('proficient') || input.includes('skill level') || input.includes('how good') || input.includes('rate')) {
        // check if user requested 'all'
        if (input.includes('all') || input.includes('everything') || input.includes('all skills')) {
            return {
                intent: 'confidence',
                response: formatConfidence(resumeData.confidence)
            };
        }

        // try to find a specific skill mentioned in the confidence list
        // Sort by length (desc) so longer names like 'C++' get matched before shorter ones like 'C'
        const confidenceList = (resumeData.confidence || []).slice().sort((a, b) => b.skill.length - a.skill.length);
        const skillQuery = confidenceList.find(c => {
            const pattern = new RegExp(`(^|[^\\w])${escapeRegExp(c.skill.toLowerCase())}([^\\w]|$)`);
            return pattern.test(input);
        });
        if (skillQuery) {
            return {
                intent: 'confidence',
                response: formatConfidence([skillQuery])
            };
        }

        // try matching against known skill names (languages/tools/domains) using token-aware matching
        const known = [...(resumeData.skills.languages || []), ...(resumeData.skills.tools || []), ...(resumeData.skills.domains || [])]
            .map(k => k.toLowerCase())
            .sort((a, b) => b.length - a.length);
        const knownMatch = known.find(k => {
            const pattern = new RegExp(`(^|[^\\w])${escapeRegExp(k)}([^\\w]|$)`);
            return pattern.test(input);
        });
        if (knownMatch) {
            const conf = (resumeData.confidence || []).find(c => c.skill.toLowerCase() === knownMatch.toLowerCase());
            if (conf) {
                return {
                    intent: 'confidence',
                    response: formatConfidence([conf])
                };
            }
        }

        // nothing specific found: prompt user with available skills
        return {
            intent: ['confidence', 'skill level'],
            response: `I can provide confidence ratings for specific skills. Available: ${(resumeData.confidence || []).map(c => c.skill).join(', ')}. Ask for one like 'confidence in Python' or 'confidence all'.`
        };
    }

    // default fallback in case intent doesn't match 
    // Customize the fallback message to guide users:
    // response: "Sorry, I didn't understand — try 'Tell me about your projects' or 'What technologies do you use?'"
    return {
        intent: 'unknown',
        response: "I can tell you about my skills, projects or experience. What would you like to know?"
    }; 
};

const formatSkills = (skills) => {
    return `Here are my technical skills: 
Languages: ${skills.languages.join(', ')}
Tools: ${skills.tools.join(', ')}
Domains: ${skills.domains.join(', ')}`;  
};

const formatProjects = (projects) => {
    let response = "Here are some of my projects: \n\n";
    projects.forEach((project, index) => {
        response += `**${project.title}**\n`;
        response += `> ${project.summary}\n`;
        response += `*Tech:* ${project.tech.join(', ')}\n`;
        response += `*Link:* ${project.links.github}`
        response += `\n----\n\n`;
    });
    return response;
};

const formatConfidence = (confArray) => {
    if (!confArray || confArray.length === 0) return "No confidence data available.";

    const ratingText = (r) => {
        const map = {
            1: 'Beginner',
            2: 'Novice',
            3: 'Intermediate',
            4: 'Advanced',
            5: 'Expert'
        };
        return map[r] || 'Unknown';
    };

    if (confArray.length === 1) {
        const c = confArray[0];
        return `${c.skill}: ${c.rating}/5 (${ratingText(c.rating)})`;
    }

    return confArray.map(c => `${c.skill}: ${c.rating}/5 (${ratingText(c.rating)})`).join('\n');
};