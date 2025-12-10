
export const pushCodeToGithub = async (
    token: string, 
    repoName: string, 
    fileName: string, 
    code: string,
    description?: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
        const response = await fetch('/api/github-sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                repoName,
                fileName,
                content: code,
                description
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || 'Failed to push code' };
        }

        return { success: true, url: data.url };
    } catch (error) {
        console.error("Github Service Error:", error);
        return { success: false, error: "Network connection error" };
    }
};
