interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <div className=" bg-muted flex h-svh flex-col items-center justify-center p-4 md:p-8">
        <div className=" w-full max-w-sm md:max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
