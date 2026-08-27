import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-toastify'

const schema = yup.object({ email: yup.string().email().required() })

function ForgotPassword() {
  const { register, handleSubmit } = useForm({ resolver: yupResolver(schema), defaultValues: { email: '' } })
  const onSubmit = () => { toast.success('Reset link sent to email (mock)'); }
  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold">Forgot password</h1>
      <p className="text-sm text-slate dark:text-slatedark mt-1 mb-6">We will send reset instructions</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" {...register('email')} />
        <Button type="submit" className="w-full justify-center">Send reset link</Button>
        <p className="text-xs text-center"><Link to="/login" className="text-cobalt underline">Back to login</Link></p>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
