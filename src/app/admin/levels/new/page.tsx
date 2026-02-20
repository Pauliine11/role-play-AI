'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { TextArea } from '@/shared/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/shared/providers/LanguageContext';
import Link from 'next/link';

// Form schema matching the database structure
const formSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères"),
  description: z.string().optional(),
  // Use z.number with string coercion handled by react-hook-form's valueAsNumber or Zod's coerce
  // Here we keep coerce but we need to ensure the types match for RHF
  order_index: z.coerce.number().min(1, "L'ordre doit être au moins 1"),
  content: z.string().optional(), // Textarea input for JSON
  is_active: z.boolean(),
});

type FormInput = z.infer<typeof formSchema>;

export default function CreateLevelPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_index: 1,
      is_active: false,
      content: "{}",
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    setError(null);
    setSuccess(false);

    try {
      // Validate JSON content if provided
      let parsedContent = {};
      if (data.content) {
        try {
          parsedContent = JSON.parse(data.content);
        } catch (_e) {
          setError("Le champ Contenu doit être un JSON valide");
          return;
        }
      }

      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          content: parsedContent,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        const errorMessage = result.message || result.error || 'Erreur lors de la création du niveau';
        const errorDetails = result.details ? ` (${result.details})` : '';
        throw new Error(errorMessage + errorDetails);
      }

      setSuccess(true);
      reset();
      router.refresh();
      // Optional: Redirect to list or stay
      // router.push('/admin/levels'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen text-[#E6D5A7] relative overflow-hidden flex flex-col" style={{ fontFamily: 'var(--font-merriweather)' }}>
      <header className="relative z-10 p-6 border-b-2 border-[#3A2F1E] backdrop-blur-md bg-[#0E1320]/80 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/"
            data-testid="back-to-home-button"
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#141B2D] hover:bg-[#6B4F2F] border-2 border-[#3A2F1E] hover:border-[#C9A227] rounded-lg text-[#B8A77E] hover:text-[#E6D5A7] text-sm transition-all mb-4 font-semibold shadow-lg"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            ← {t('admin.backToHome')}
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#C9A227] mb-2 drop-shadow-lg tracking-wide" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {t('admin.title')}
            </h1>
            <p className="text-[#B8A77E] text-sm" style={{ fontFamily: 'var(--font-merriweather)' }}>{t('admin.subtitle')}</p>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto p-6 w-full">
        {error && (
          <div data-testid="error-message" className="bg-[#8B2C2C]/40 text-[#E6D5A7] p-4 rounded-xl mb-6 border-2 border-[#B84040] shadow-lg font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>
            {error}
          </div>
        )}

        {success && (
          <div data-testid="success-message" className="bg-[#C9A227]/60 text-[#0E1320] p-4 rounded-xl mb-6 border-2 border-[#E6C847] shadow-[0_0_20px_rgba(230,200,71,0.4)] font-bold" style={{ fontFamily: 'var(--font-merriweather)' }}>
            ✅ {t('admin.success')}
          </div>
        )}

        <div className="bg-[#141B2D]/80 rounded-xl border-2 border-[#3A2F1E] backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  data-testid="level-title-input"
                  type="text"
                  label={t('admin.form.titleLabel')}
                  placeholder={t('admin.form.titlePlaceholder')}
                  error={errors.title?.message}
                  {...register('title')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    data-testid="level-order-input"
                    type="number"
                    label={t('admin.form.orderLabel')}
                    placeholder={t('admin.form.orderPlaceholder')}
                    error={errors.order_index?.message}
                    {...register('order_index')}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#B8A77E] mb-2" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                      {t('admin.form.statusLabel')}
                    </label>
                    <div className="flex items-center space-x-3 bg-[#101827] p-3 rounded-lg border-2 border-[#3A2F1E] h-[46px]">
                      <input
                        data-testid="level-is-active-checkbox"
                        type="checkbox"
                        id="is_active"
                        className="w-5 h-5 accent-[#C9A227] bg-[#101827] border-[#3A2F1E] rounded focus:ring-[#C9A227] cursor-pointer"
                        {...register('is_active')}
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-[#B8A77E] cursor-pointer whitespace-nowrap" style={{ fontFamily: 'var(--font-merriweather)' }}>
                        {t('admin.form.activeCheckbox')}
                      </label>
                    </div>
                  </div>
                </div>

                <TextArea
                  data-testid="level-description-input"
                  label={t('admin.form.descriptionLabel')}
                  placeholder={t('admin.form.descriptionPlaceholder')}
                  rows={3}
                  error={errors.description?.message}
                  {...register('description')}
                />

                <div className="space-y-2">
                  <TextArea
                    data-testid="level-content-textarea"
                    label={t('admin.form.contentLabel')}
                    placeholder={t('admin.form.contentPlaceholder')}
                    rows={8}
                    className="font-mono text-xs text-[#C9A227] bg-[#0E1320]/90"
                    error={errors.content?.message}
                    {...register('content')}
                  />
                  <p className="text-xs text-[#8C7A5E]" style={{ fontFamily: 'var(--font-merriweather)' }}>
                    {t('admin.form.contentHint')}
                  </p>
                </div>

                <Button 
                    data-testid="level-submit-button"
                    type="submit" 
                    isLoading={isSubmitting} 
                    variant="primary"
                    className="w-full py-4 text-base"
                >
                    {isSubmitting ? t('admin.form.submitting') : t('admin.form.submitButton')}
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
}
