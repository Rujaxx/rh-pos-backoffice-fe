'use client';

import React from 'react';
import { FeedbackQuestionFormSchema } from '@/lib/validations/feedback-question.validation';
import {
  QuestionTypeEnum,
  RatingShapeEnum,
} from '@/types/feedback-config.type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Heart, Circle, Square, Smile, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface FeedbackQuestionPreviewProps {
  question: Partial<FeedbackQuestionFormSchema>;
}

export const FeedbackQuestionPreview: React.FC<
  FeedbackQuestionPreviewProps
> = ({ question }) => {
  if (!question || !question.type) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select or add a question to preview
      </div>
    );
  }

  const renderContent = () => {
    switch (question.type) {
      case QuestionTypeEnum.WELCOME_SCREEN:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-center p-4">
            <h2 className="text-xl font-bold">
              {question.welcomeText || 'Welcome Message'}
            </h2>
            {question.showButton !== false && (
              <Button className="w-full max-w-xs">
                {question.buttonText || 'Continue'}
              </Button>
            )}
          </div>
        );

      case QuestionTypeEnum.PHONE_NUMBER:
        return (
          <div className="flex flex-col justify-center h-full space-y-4 p-4">
            <Label>{question.phoneNumberText || 'Enter Phone Number'}</Label>
            <Input type="tel" placeholder="+1234567890" />
            <Button className="w-full mt-4">Next</Button>
          </div>
        );

      case QuestionTypeEnum.RATING:
        const Icon = getRatingIcon(question.shape);
        const steps = question.steps || 5;
        const activeColor = question.rateColor || '#FFD700';
        const emptyColor = question.emptyRateColor || '#D3D3D3';

        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 p-4 text-center">
            <h3 className="text-lg font-medium">
              {question.ratingText || 'Rate us'}
            </h3>
            <div className="flex gap-2">
              {Array.from({ length: steps }).map((_, i) => (
                <Icon
                  key={i}
                  className="w-8 h-8"
                  fill={i < 3 ? activeColor : emptyColor}
                  color={i < 3 ? activeColor : emptyColor}
                />
              ))}
            </div>
          </div>
        );

      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return (
          <div className="flex flex-col justify-center h-full space-y-4 p-4">
            <h3 className="text-lg font-medium text-center">
              {question.questionText || 'Select options'}
            </h3>
            <div
              className={cn(
                'grid gap-2',
                question.verticalAlignment ? 'grid-cols-1' : 'grid-cols-2',
              )}
            >
              {question.choices?.map((c, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                >
                  {c.text || `Option ${i + 1}`}
                </Button>
              ))}
              {(!question.choices || question.choices.length === 0) && (
                <div className="text-sm text-muted-foreground text-center col-span-full">
                  No choices added
                </div>
              )}
            </div>
          </div>
        );

      case QuestionTypeEnum.INPUT_FIELD:
        return (
          <div className="flex flex-col justify-center h-full space-y-4 p-4">
            <Label>{question.questionText || 'Your Feedback'}</Label>
            <Textarea
              placeholder={question.placeholder || 'Type here...'}
              maxLength={question.maxLength}
              className="min-h-[100px]"
            />
          </div>
        );

      case QuestionTypeEnum.YES_NO:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 p-4">
            <h3 className="text-lg font-medium text-center">
              {question.questionText || 'Yes or No?'}
            </h3>
            <div className="flex gap-4 w-full">
              <Button variant="outline" className="flex-1 py-6">
                {question.yesText || 'Yes'}
              </Button>
              <Button variant="outline" className="flex-1 py-6">
                {question.noText || 'No'}
              </Button>
            </div>
          </div>
        );

      case QuestionTypeEnum.THANK_YOU_SCREEN:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-center p-4">
            <Heart className="w-16 h-16 text-primary fill-primary/20 animate-pulse" />
            <h2 className="text-2xl font-bold">
              {question.thankYouMessage || 'Thank You!'}
            </h2>
            {question.loyaltyMessage && (
              <p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {question.loyaltyMessage}
              </p>
            )}
            {question.showButton !== false && (
              <Button variant="secondary">
                {question.buttonText || 'Close'}
              </Button>
            )}
            {question.redirectUrl && (
              <p className="text-xs text-muted-foreground mt-4">
                Redirecting...
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            Preview not available for {question.type}
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-center h-full p-4 bg-slate-50">
      {/* Phone Mockup */}
      <div className="relative w-[300px] h-[600px] bg-white rounded-[3rem] border-8 border-slate-900 shadow-xl overflow-hidden">
        {/* Notch/Island - simplified */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full pt-10 pb-4 overflow-y-auto bg-white">
          {renderContent()}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-20"></div>
      </div>
    </div>
  );
};

const getRatingIcon = (shape?: string) => {
  switch (shape) {
    case RatingShapeEnum.HEART:
      return Heart;
    case RatingShapeEnum.CIRCLE:
      return Circle;
    case RatingShapeEnum.SQUARE:
      return Square;
    case RatingShapeEnum.EMOJI:
      return Smile;
    case RatingShapeEnum.STAR:
    default:
      return Star;
  }
};
