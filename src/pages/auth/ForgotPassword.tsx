import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  function onSubmit(values: { email: string }) {
    toast.info(`Reset link sent to ${values.email} (demo UI only).`);
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-paper">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-md">
        <span className="ticket-tag">HOTEL · RECOVERY</span>
        <h1 className="font-display font-semibold text-3xl mt-3 tracking-tight">Reset password</h1>
        <p className="text-sm text-slate mt-1 mb-6">Enter your staff email to receive a reset link.</p>
        <label className="block mb-4">
          <span className="text-sm font-medium">Email</span>
          <input className="field mt-1" placeholder="you@harborstay.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
          {errors.email && <span className="text-xs text-rose">{errors.email.message}</span>}
        </label>
        <button type="submit" className="btn-primary w-full">Send reset link</button>
        <p className="mt-4 text-sm text-center"><Link to="/login" className="text-cobalt">Back to login</Link></p>
      </form>
    </div>
  );
}
