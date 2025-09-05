'use client';

import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Certificate, CreateCertificateDto, UpdateCertificateDto } from '@/lib/types/certificate.types';

interface CertificateFormProps {
  certificate?: Certificate;
  onSubmit: (data: CreateCertificateDto | UpdateCertificateDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CertificateForm({ 
  certificate, 
  onSubmit, 
  onCancel, 
  loading = false 
}: CertificateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateCertificateDto>({
    defaultValues: certificate ? {
      title: certificate.title,
      issuer: certificate.issuer,
      credentialUrl: certificate.credentialUrl || '',
      credentialId: certificate.credentialId || '',
      dateIssued: format(new Date(certificate.dateIssued), 'yyyy-MM-dd'),
      expirationDate: certificate.expirationDate ? format(new Date(certificate.expirationDate), 'yyyy-MM-dd') : '',
      doesNotExpire: certificate.doesNotExpire,
      displayOrder: certificate.displayOrder,
    } : {
      title: '',
      issuer: '',
      credentialUrl: '',
      credentialId: '',
      dateIssued: '',
      expirationDate: '',
      doesNotExpire: false,
      displayOrder: 0,
    }
  });

  const doesNotExpire = watch('doesNotExpire');

  const handleFormSubmit = async (data: CreateCertificateDto) => {
    const submitData = {
      ...data,
      expirationDate: data.doesNotExpire ? undefined : data.expirationDate,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            {...register('title', { 
              required: 'Title is required',
              maxLength: { value: 150, message: 'Title must be 150 characters or less' }
            })}
            type="text"
            id="title"
            className="input-field"
            placeholder="e.g. AWS Solutions Architect"
          />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-2">
            Issuer *
          </label>
          <input
            {...register('issuer', { 
              required: 'Issuer is required',
              maxLength: { value: 100, message: 'Issuer must be 100 characters or less' }
            })}
            type="text"
            id="issuer"
            className="input-field"
            placeholder="e.g. Amazon Web Services"
          />
          {errors.issuer && <p className="form-error">{errors.issuer.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Credential URL
          </label>
          <input
            {...register('credentialUrl', {
              maxLength: { value: 255, message: 'URL must be 255 characters or less' }
            })}
            type="url"
            id="credentialUrl"
            className="input-field"
            placeholder="https://..."
          />
          {errors.credentialUrl && <p className="form-error">{errors.credentialUrl.message}</p>}
        </div>

        <div>
          <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 mb-2">
            Credential ID
          </label>
          <input
            {...register('credentialId', {
              maxLength: { value: 100, message: 'Credential ID must be 100 characters or less' }
            })}
            type="text"
            id="credentialId"
            className="input-field"
            placeholder="e.g. ABC123XYZ"
          />
          {errors.credentialId && <p className="form-error">{errors.credentialId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dateIssued" className="block text-sm font-medium text-gray-700 mb-2">
            Date Issued *
          </label>
          <input
            {...register('dateIssued', { required: 'Date issued is required' })}
            type="date"
            id="dateIssued"
            className="input-field"
          />
          {errors.dateIssued && <p className="form-error">{errors.dateIssued.message}</p>}
        </div>

        <div>
          <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            {...register('displayOrder', { 
              valueAsNumber: true,
              min: { value: 0, message: 'Display order must be 0 or greater' }
            })}
            type="number"
            id="displayOrder"
            className="input-field"
            placeholder="0"
          />
          {errors.displayOrder && <p className="form-error">{errors.displayOrder.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            {...register('doesNotExpire')}
            type="checkbox"
            id="doesNotExpire"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            onChange={(e) => {
              setValue('doesNotExpire', e.target.checked);
              if (e.target.checked) {
                setValue('expirationDate', '');
              }
            }}
          />
          <label htmlFor="doesNotExpire" className="ml-2 block text-sm text-gray-700">
            This certificate does not expire
          </label>
        </div>

        {!doesNotExpire && (
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <input
              {...register('expirationDate')}
              type="date"
              id="expirationDate"
              className="input-field"
            />
            {errors.expirationDate && <p className="form-error">{errors.expirationDate.message}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : certificate ? 'Update Certificate' : 'Create Certificate'}
        </button>
      </div>
    </form>
  );
}