import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { cn } from '@/shared/lib/cn'
import { formatFullName, formatInitials } from '@/shared/lib/format'

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-14 w-14 text-base',
  lg: 'h-24 w-24 text-2xl',
}

interface PersonAvatarProps {
  firstName: string
  lastName: string
  photoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PersonAvatar({
  firstName,
  lastName,
  photoUrl,
  size = 'md',
  className,
}: PersonAvatarProps) {
  return (
    <Avatar className={cn(SIZE_CLASSES[size], className)}>
      {photoUrl && <AvatarImage src={photoUrl} alt={formatFullName(firstName, lastName)} />}
      <AvatarFallback className="font-medium">
        {formatInitials(firstName, lastName)}
      </AvatarFallback>
    </Avatar>
  )
}
