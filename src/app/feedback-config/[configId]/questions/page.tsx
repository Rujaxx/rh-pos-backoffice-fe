'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFeedbackConfig } from '@/services/api/feedback-config/feedback-config.query';
import { useFeedbackQuestions } from '@/services/api/feedback-config/feedback-questions.query';
import {
  useCreateFeedbackQuestion,
  useUpdateFeedbackQuestion,
  useDeleteFeedbackQuestion,
} from '@/services/api/feedback-config/feedback-questions.mutation';
import { FeedbackQuestionList } from '@/components/feedback-questions/feedback-question-list';
import { FeedbackQuestionPreview } from '@/components/feedback-questions/feedback-question-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { FeedbackQuestion } from '@/types/feedback-config.type';
import { FeedbackQuestionForm } from '@/components/feedback-questions/feedback-question-form';

export default function FeedbackQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const configId = params.configId as string;

  const { data: configResponse } = useFeedbackConfig(configId);
  const { data: questionsResponse, isLoading } = useFeedbackQuestions(configId);

  const createMutation = useCreateFeedbackQuestion(configId);
  const updateMutation = useUpdateFeedbackQuestion(configId);
  const deleteMutation = useDeleteFeedbackQuestion(configId);

  const config = configResponse?.data;
  const questions = questionsResponse?.data || [];

  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'add'>('list');
  const [selectedQuestion, setSelectedQuestion] =
    useState<FeedbackQuestion | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    if (viewMode === 'list') {
      if (selectedQuestion) {
        setPreviewData(selectedQuestion);
      } else if (questions.length > 0) {
        setPreviewData(questions[0]);
      } else {
        setPreviewData(null);
      }
    }
  }, [viewMode, selectedQuestion, questions]);

  // Handlers
  const handleBack = () => {
    if (viewMode === 'list') {
      router.back();
    } else {
      setViewMode('list');
      setSelectedQuestion(null);
    }
  };

  const handleAddStart = () => {
    setSelectedQuestion(null);
    setPreviewData({});
    setViewMode('add');
  };

  const handleEditStart = (q: FeedbackQuestion) => {
    setSelectedQuestion(q);
    setPreviewData(q);
    setViewMode('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await deleteMutation.mutateAsync(id);
      if (selectedQuestion?._id === id) {
        setSelectedQuestion(null);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      if (viewMode === 'edit' && selectedQuestion) {
        await updateMutation.mutateAsync({
          questionId: selectedQuestion._id,
          data,
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          feedbackConfigId: configId,
        });
      }
      setViewMode('list');
    } catch (error) {
      console.error(error);
    }
  };

  // Callback from Form to update Preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (data: any) => {
    setPreviewData(data);
  };

  const isLoadingAction = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b flex items-center px-6 justify-between bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              {viewMode === 'list'
                ? `Manage Questions: ${config?.campaignName || 'Loading...'}`
                : viewMode === 'add'
                  ? 'Add Question'
                  : 'Edit Question'}
            </h1>
          </div>
        </div>
        {/* Add Question button temporarily disabled */}
        {/* {viewMode === 'list' && (
          <Button onClick={handleAddStart}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )} */}
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Left Panel: List or Form */}
          <div className="lg:col-span-7 overflow-y-auto p-6 border-r">
            {viewMode === 'list' ? (
              <FeedbackQuestionList
                questions={questions}
                onSelect={(q) => {
                  setSelectedQuestion(q);
                  setPreviewData(q);
                }}
                onDelete={handleDelete}
                selectedId={
                  selectedQuestion?._id ||
                  (questions.length > 0 ? questions[0]?._id : undefined)
                }
              />
            ) : (
              <div className="max-w-xl mx-auto">
                <FeedbackQuestionForm
                  initialData={
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (selectedQuestion as any) || undefined
                  }
                  onSubmit={handleSubmit}
                  isLoading={isLoadingAction}
                  onCancel={() => handleBack()}
                  onValuesChange={handleFormChange}
                />
              </div>
            )}
          </div>

          {/* Right Panel: Live Preview */}
          <div className="lg:col-span-5 bg-slate-50 h-full flex flex-col border-l">
            <div className="p-4 border-b bg-white">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
                {viewMode === 'list'
                  ? 'Selected Question Preview'
                  : 'Live Preview'}
              </h2>
            </div>
            <div className="flex-1 relative">
              <FeedbackQuestionPreview question={previewData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
