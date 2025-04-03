import { PromptMode } from '../prompts';

export function formatResponse(response: string, mode: PromptMode): string[] {
  response = response.replace(/\*\*/g, '').trim(); // Supprimer les **

  const sections: string[] = [];

  if (mode === 'resumeMode') {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    let section = '';
    lines.forEach((line) => {
      if (line.startsWith('📌') || line.startsWith('📑')) {
        if (section) sections.push(section.trim());
        section = line;
      } else {
        section += '\n' + line;
      }
    });
    if (section) sections.push(section.trim());
  }

  else if (mode === 'explainMode') {
    const parts = response.split(/### |#### /).filter(Boolean);
    parts.forEach((part) => {
      sections.push(part.trim());
    });
  }

  else if (mode === 'stageAdvices' || mode === 'examQuestions') {
    const blocks = response.split('\n\n').filter(b => b.trim() !== '');
    blocks.forEach((block) => {
      sections.push(block.trim());
    });
  }

  else {
    // Mode Default
    sections.push(response);
  }

  return sections;
}
