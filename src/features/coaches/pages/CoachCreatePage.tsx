import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { formatCategory } from '@/shared/lib/format'
import { CATEGORIES, type Category } from '@/shared/types/domain'
import { useCreateCoach } from '../api/coaches.mutations'
import { CoachForm } from '../components/CoachForm'
import type { CoachFormValues } from '../schemas/coach.schema'

export function CoachCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createCoach = useCreateCoach()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  function toggleCategory(category: Category, checked: boolean) {
    setSelectedCategories((prev) => (checked ? [...prev, category] : prev.filter((c) => c !== category)))
  }

  async function handleSubmit(values: CoachFormValues) {
    if (selectedCategories.length === 0) {
      toast.error(t('coaches.categoriesEditor.atLeastOne'))
      return
    }
    const coach = await createCoach.mutateAsync({ ...values, categories: selectedCategories })
    navigate(`/coaches/${coach.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{t('coaches.form.createTitle')}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('coaches.categoriesEditor.title')}</CardTitle>
          <CardDescription>{t('coaches.categoriesEditor.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((category) => {
              const checkboxId = `coach-create-category-${category}`
              return (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={checkboxId}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => toggleCategory(category, checked === true)}
                  />
                  <Label htmlFor={checkboxId} className="cursor-pointer font-normal">
                    {formatCategory(category)}
                  </Label>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <CoachForm
        onSubmit={handleSubmit}
        submitLabel={t('coaches.form.submitCreate')}
        isPending={createCoach.isPending}
      />
    </div>
  )
}
