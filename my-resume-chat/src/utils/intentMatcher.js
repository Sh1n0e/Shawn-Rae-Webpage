import resumeData from '../data/content-modeling.json';

export const matchIntent = (userInput) => {
    const input = userInput.toLowerCase();

    // intent matching for skills 
    if(input.includes('skill') || input.includes('technology') || input.includes('tools')) {
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

    // default fallback in case intent doesn't match 
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
        response += `*Tech:* ${project.tech.join(', ')}\n\n`;
        response += `----\n\n`;
    });
    return response;
};