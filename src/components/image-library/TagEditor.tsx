// TagEditor component for managing tags in Image Library forms
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TagEditorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagEditor = ({ tags = [], onChange }: TagEditorProps) => {
  const [input, setInput] = useState('');
  const [localTags, setLocalTags] = useState<string[]>(tags);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !localTags.includes(trimmed)) {
      const newTags = [...localTags, trimmed];
      setLocalTags(newTags);
      onChange(newTags);
      setInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = localTags.filter((t) => t !== tag);
    setLocalTags(newTags);
    onChange(newTags);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {localTags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded flex items-center"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add tag"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag()}
        />
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>
    </div>
  );
};
