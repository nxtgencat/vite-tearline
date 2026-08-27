import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'react-toastify'
import { ALL_ROLES, ROLE_LABELS } from '@/constants/roles'

const schema = yup.object({
  name: yup.string().required('Name required'),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().min(6).required(),
  role: yup.string().required(),
})

function Register() {
  const { register: doRegister, loading } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema), defaultValues: { name: '', email: '', password: '', role: 'patient' } })

  const onSubmit = async (data: never) => {
    const d = data as { name: string; email: string; password: string; role: string }
    await doRegister({ name: d.name, email: d.email, password: d.password, role: d.role as never })
    toast.success('Account created')
    navigate('/')
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-semibold">Create account</h1>
      <p className="text-sm text-slate dark:text-slatedark mt-1 mb-6">Join MediCare HMS</p>
      <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
        <Input label="Full name" {...register('name')} error={errors.name?.message} />
        <Input label="Email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        <label className="block"><span className="text-sm font-medium mb-1.5 block">Role</span>
          <select {...register('role')} className="field">{ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select>
        </label>
        <Button type="submit" loading={loading} className="w-full justify-center">Create account</Button>
        <p className="text-xs text-center">Already have account? <Link to="/login" className="text-cobalt underline">Login</Link></p>
      </form>
    </AuthLayout>
  )
}

export default Register
