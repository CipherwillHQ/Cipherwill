'use client'

import { useFeatureFlagVariantKey } from 'posthog-js/react'
import { ReactNode } from 'react'

interface ABTestProps {
  flagName: string
  variantA: ReactNode
  variantB: ReactNode
}

export default function ABTest({ flagName, variantA, variantB }: ABTestProps) {
  const variant = useFeatureFlagVariantKey(flagName)

  // Assuming 'control' is variant A, anything else is variant B
  if (variant === 'control') {
    return <>{variantA}</>
  } else {
    return <>{variantB}</>
  }
}
