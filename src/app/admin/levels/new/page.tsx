'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { levelSchema } from '@/features/levels/level';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
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
        } catch (e) {
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
          <div className="bg-[#8B2C2C]/40 text-[#E6D5A7] p-4 rounded-xl mb-6 border-2 border-[#B84040] shadow-lg font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#C9A227]/60 text-[#0E1320] p-4 rounded-xl mb-6 border-2 border-[#E6C847] shadow-[0_0_20px_rgba(230,200,71,0.4)] font-bold" style={{ fontFamily: 'var(--font-merriweather)' }}>
            ✅ {t('admin.success')}
          </div>
        )}

        <div className="bg-[#141B2D]/80 rounded-xl border-2 border-[#3A2F1E] backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#B8A77E]" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                        {t('admin.form.titleLabel')}
                    </label>
                    <input
                        type="text"
                        placeholder={t('admin.form.titlePlaceholder')}
                        className="block p-3 w-full text-[#E6D5A7] bg-[#101827] rounded-lg border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] transition-all shadow-inner"
                        style={{ fontFamily: 'var(--font-merriweather)' }}
                        {...register('title')}
                    />
                    {errors.title && <p className="text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#B8A77E]" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                          {t('admin.form.orderLabel')}
                      </label>
                      <input
                          type="number"
                          className="block p-3 w-full text-[#E6D5A7] bg-[#101827] rounded-lg border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] transition-all shadow-inner"
                          style={{ fontFamily: 'var(--font-merriweather)' }}
                          placeholder={t('admin.form.orderPlaceholder')}
                          {...register('order_index')}
                      />
                      {errors.order_index && <p className="text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>{errors.order_index.message}</p>}
                  </div>

                   <div className="space-y-2">
                        <label className="block text-sm font-semibold text-[#B8A77E] mb-2" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                            {t('admin.form.statusLabel')}
                        </label>
                        <div className="flex items-center space-x-3 bg-[#101827] p-3 rounded-lg border-2 border-[#3A2F1E] h-[46px]">
                            <input
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

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#B8A77E]" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                        {t('admin.form.descriptionLabel')}
                    </label>
                    <textarea
                        className="block p-3 w-full text-[#E6D5A7] bg-[#101827] rounded-lg border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] transition-all resize-none shadow-inner"
                        style={{ fontFamily: 'var(--font-merriweather)' }}
                        rows={3}
                        placeholder={t('admin.form.descriptionPlaceholder')}
                        {...register('description')}
                    />
                    {errors.description && <p className="text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#B8A77E]" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                        {t('admin.form.contentLabel')}
                    </label>
                    <textarea
                        className="block p-3 w-full font-mono text-xs text-[#C9A227] bg-[#0E1320]/90 rounded-lg border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] transition-all resize-none shadow-inner"
                        rows={8}
                        placeholder={t('admin.form.contentPlaceholder')}
                        {...register('content')}
                    />
                    <p className="text-xs text-[#8C7A5E]" style={{ fontFamily: 'var(--font-merriweather)' }}>
                        {t('admin.form.contentHint')}
                    </p>
                    {errors.content && <p className="text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>{errors.content.message}</p>}
                </div>

                <Button 
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
