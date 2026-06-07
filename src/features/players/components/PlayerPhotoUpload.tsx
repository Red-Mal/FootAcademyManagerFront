import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Camera, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PersonAvatar } from '@/shared/components/domain/PersonAvatar'
import { useUploadPlayerPhoto } from '../api/players.mutations'

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

interface PlayerPhotoUploadProps {
  playerId: string
  firstName: string
  lastName: string
  photoUrl: string | null
}

export function PlayerPhotoUpload({ playerId, firstName, lastName, photoUrl }: PlayerPhotoUploadProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const uploadPhoto = useUploadPlayerPhoto(playerId)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      toast.error(t('players.errors.photoInvalidType'))
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(t('players.errors.photoTooBig'))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    uploadPhoto.mutate(file, {
      onSettled: () => {
        URL.revokeObjectURL(objectUrl)
        setPreviewUrl(null)
      },
    })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <PersonAvatar
          firstName={firstName}
          lastName={lastName}
          photoUrl={previewUrl ?? photoUrl}
          size="lg"
        />
        {uploadPhoto.isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploadPhoto.isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
        {t('players.photo.change')}
      </Button>
    </div>
  )
}
