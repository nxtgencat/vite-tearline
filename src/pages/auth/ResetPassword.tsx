import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-toastify'

const schema = yup.object({ password: yup.string().min(6).required(), confirm: yup.string().oneOf([yup.ref('password')], 'Mismatch').required() })

function ResetPassword() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema), defaultValues: { password: '', confirm: '' } })
  const onSubmit = () => { toast.success('Password reset (mock)'); navigate('/login') }
  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold">Reset password</h1>
      <p className="text-sm text-slate dark:text-slatedark mt-1 mb-6">Set a new password</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="New password" type="password" {...register('password')} />
        <Input label="Confirm password" type="password" {...register('confirm')} />
        <Button type="submit" className="w-full justify-center">Update password</Button>
        <p className="text-xs text-center"><Link to="/login" className="text-cobalt underline">Back to login</Link></p>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
