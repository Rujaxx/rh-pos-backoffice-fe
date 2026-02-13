'use client';

import React from 'react';
import { FeedbackQuestion } from '@/types/feedback-config.type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Phone,
  Star,
  List,
  Type,
  Sliders,
  ToggleLeft,
  Menu,
  Heart,
  Edit2,
  Trash2,
} from 'lucide-react';
import { QuestionTypeEnum } from '@/types/feedback-config.type';

interface FeedbackQuestionListProps {
  questions: FeedbackQuestion[];
  onSelect: (question: FeedbackQuestion) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export const FeedbackQuestionList: React.FC<FeedbackQuestionListProps> = ({
  questions,
  onSelect,
  onDelete,
  selectedId,
}) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions added yet. Click &quot;Add Question&quot; to start.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q) => (
        <Card
          key={q._id}
          className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
            selectedId === q._id ? 'border-primary bg-accent/20' : ''
          }`}
          onClick={() => onSelect(q)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-md text-muted-foreground">
              {getIconForType(q.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">
                  {getQuestionTitle(q)}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 rounded">
                  Order: {q.order}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {q.type.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {/* Actions prevented from triggering select */}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(q._id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Helpers
const getIconForType = (type: QuestionTypeEnum) => {
  switch (type) {
    case QuestionTypeEnum.WELCOME_SCREEN:
      return <MessageSquare className="h-4 w-4" />;
    case QuestionTypeEnum.PHONE_NUMBER:
      return <Phone className="h-4 w-4" />;
    case QuestionTypeEnum.RATING:
      return <Star className="h-4 w-4" />;
    case QuestionTypeEnum.MULTIPLE_CHOICE:
      return <List className="h-4 w-4" />;
    case QuestionTypeEnum.INPUT_FIELD:
      return <Type className="h-4 w-4" />;
    case QuestionTypeEnum.SCALE:
      return <Sliders className="h-4 w-4" />;
    case QuestionTypeEnum.YES_NO:
      return <ToggleLeft className="h-4 w-4" />;
    case QuestionTypeEnum.ORDER_ITEMS:
      return <Menu className="h-4 w-4" />;
    case QuestionTypeEnum.THANK_YOU_SCREEN:
      return <Heart className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getQuestionTitle = (q: FeedbackQuestion) => {
  // Use specific text fields based on type, fallback to type name
  if (q.welcomeText) return q.welcomeText;
  if (q.questionText) return q.questionText;
  if (q.ratingText) return q.ratingText;
  if (q.scaleText) return q.scaleText;
  if (q.thankYouMessage) return q.thankYouMessage;
  if (q.phoneNumberText) return q.phoneNumberText;

  return q.type;
};
