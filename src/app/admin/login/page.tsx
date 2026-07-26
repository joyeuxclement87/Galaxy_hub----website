import Image from "next/image";
import { createAuthClient } from "@/lib/supabase-server-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a1628] px-4 overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#0f70c9]/15 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#0b5497]/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-40 w-40 rounded-full bg-white/[0.02] blur-2xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="login-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#login-dots)" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mb-5 flex justify-center">
            <div className="relative h-10 w-40">
              <Image
                src="/g-hub logo.png"
                alt="Galaxy Hub"
                fill
                className="object-contain brightness-0 invert"
                sizes="160px"
                priority
              />
            </div>
          </div>
          <h1 className="font-clash text-xl font-bold text-white">Admin Sign In</h1>
          <p className="mt-1.5 text-sm text-white/40">Enter your credentials to continue</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <LoginForm />
        </div>

        <p className="text-center text-[11px] text-white/20 font-medium">
          Galaxy Hub Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
