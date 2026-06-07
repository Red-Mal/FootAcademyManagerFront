import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { formatCategory } from '@/shared/lib/format'
import { CATEGORIES, type Category } from '@/shared/types/domain'
import { useUpdateCoachCategories } from '../api/coaches.mutations'

interface CoachCategoriesEditorProps {
  coachId: string
  categories: Category[]
}

export function CoachCategoriesEditor({ coachId, categories }: CoachCategoriesEditorProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Category[]>(categories)
  const [syncedCategories, setSyncedCategories] = useState(categories)
  const updateCategories = useUpdateCoachCategories(coachId)

  // Resynchronise la sélection locale quand les catégories du coach changent
  // depuis l'extérieur (ex. rechargement après une mutation réussie).
  // Ajustement pendant le rendu plutôt qu'un effet, pour éviter un rendu
  // intermédiaire avec une valeur obsolète.
  if (categories !== syncedCategories) {
    setSyncedCategories(categories)
    setSelected(categories)
  }

  function toggle(category: Category, checked: boolean) {
    setSelected((prev) => (checked ? [...prev, category] : prev.filter((c) => c !== category)))
  }

  function handleSave() {
    if (selected.length === 0) {
      toast.error(t('coaches.categoriesEditor.atLeastOne'))
      return
    }
    updateCategories.mutate({ categories: selected })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('coaches.categoriesEditor.title')}</CardTitle>
        <CardDescription>{t('coaches.categoriesEditor.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((category) => {
            const checkboxId = `coach-category-${category}`
            return (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={checkboxId}
                  checked={selected.includes(category)}
                  onCheckedChange={(checked) => toggle(category, checked === true)}
                />
                <Label htmlFor={checkboxId} className="cursor-pointer font-normal">
                  {formatCategory(category)}
                </Label>
              </div>
            )
          })}
        </div>

        <Button type="button" onClick={handleSave} disabled={updateCategories.isPending}>
          {updateCategories.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {updateCategories.isPending
            ? t('coaches.categoriesEditor.saving')
            : t('coaches.categoriesEditor.save')}
        </Button>
      </CardContent>
    </Card>
  )
}
