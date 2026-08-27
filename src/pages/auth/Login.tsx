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
import { ALL_ROLES, ROLE_LABELS, type Role } from '@/constants/roles'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(6, 'Min 6 chars').required('Password required'),
  role: yup.string().required(),
})

type Form = yup.InferType<typeof schema>

function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: { email: 'admin@hospital.com', password: 'admin123', role: 'admin' }
  })

  const onSubmit = async (data: Form) => {
    try {
      await login(data.email, data.password, data.role as Role)
      toast.success('Welcome back!')
      navigate('/')
    } catch {
      toast.error('Login failed')
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Login</h1>
        <p className="text-sm text-slate dark:text-slatedark mt-1">Access your hospital workspace</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" placeholder="admin@hospital.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        <label className="block"><span className="text-sm font-medium mb-1.5 block">Role</span>
          <select {...register('role')} className="field">
            {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </label>
        <Button type="submit" loading={loading} className="w-full justify-center">Sign in</Button>
        <div className="flex justify-between text-xs">
          <Link to="/register" className="text-cobalt hover:underline">Create account</Link>
          <Link to="/forgot" className="text-slate dark:text-slatedark hover:underline">Forgot password?</Link>
        </div>
      </form>
      <div className="mt-6 rounded-lg bg-paper dark:bg-inkdark p-3 border border-dashed border-line dark:border-linedark">
        <p className="mini-tag mb-2">Demo credentials</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span>admin@hospital.com / admin123</span><span>doctor@hospital.com / doctor123</span>
          <span>reception@hospital.com / recep123</span><span>patient@hospital.com / patient123</span>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
