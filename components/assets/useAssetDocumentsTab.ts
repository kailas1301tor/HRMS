// components/assets/useAssetDocumentsTab.ts
'use client'

import { useEffect, useState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assetService, type AssetDocument, type AssetDropdowns } from '@/services/asset-service'
import { uploadDocumentSchema, type UploadDocumentInput } from '@/validations/asset-actions.schema'
import { DOCUMENT_TYPE_FALLBACKS } from './assets-constants'
import { toast } from 'sonner'

export interface UseAssetDocumentsTabReturn {
  documents: AssetDocument[]
  isLoading: boolean
  isUploading: boolean
  isDeletingId: number | null
  docTypes: readonly { id: number; name: string }[]
  form: UseFormReturn<UploadDocumentInput>
  selectedFile: File | undefined
  fetchDocuments: () => Promise<void>
  onUploadSubmit: (data: UploadDocumentInput) => Promise<void>
  handleDelete: (docId: number) => Promise<void>
  getDocTypeName: (typeVal: string | number) => string
}

export function useAssetDocumentsTab(
  assetId: number,
  dropdowns: AssetDropdowns | null
): UseAssetDocumentsTabReturn {
  const [documents, setDocuments] = useState<AssetDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)

  const docTypes = dropdowns?.asset_document_types || DOCUMENT_TYPE_FALLBACKS

  const form = useForm<UploadDocumentInput>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      document_type: undefined,
      file: undefined
    }
  })

  const { watch, reset } = form
  const selectedFile = watch('file') as File | undefined

  const fetchDocuments = async (signal?: AbortSignal) => {
    setIsLoading(true)
    try {
      const data = await assetService.getAssetDocuments(assetId, signal)
      if (signal?.aborted) return
      setDocuments(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      console.error('Failed to load asset documents:', err)
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchDocuments(controller.signal)
    return () => {
      controller.abort()
    }
  }, [assetId])

  const onUploadSubmit = async (data: UploadDocumentInput) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('asset_id', assetId.toString())
      formData.append('document_type', data.document_type.toString())
      formData.append('file', data.file)

      await assetService.uploadAssetDocument(formData)
      toast.success('Document uploaded successfully')
      reset()
      fetchDocuments()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (docId: number) => {
    setIsDeletingId(docId)
    try {
      await assetService.deleteAssetDocument(docId)
      toast.success('Document deleted successfully')
      fetchDocuments()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete document'
      toast.error(message)
    } finally {
      setIsDeletingId(null)
    }
  }

  const getDocTypeName = (typeVal: string | number) => {
    const typeId = Number(typeVal)
    const match = docTypes.find(t => t.id === typeId)
    return match ? match.name : `Document Type #${typeVal}`
  }

  return {
    documents,
    isLoading,
    isUploading,
    isDeletingId,
    docTypes,
    form,
    selectedFile,
    fetchDocuments,
    onUploadSubmit,
    handleDelete,
    getDocTypeName,
  }
}
