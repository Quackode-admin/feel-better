import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[24px] font-bold tracking-[-0.05em] text-[#166534]">Feel Better</p>
          <p className="mt-1 text-[14px] text-[#72796E]">Panel de Administración</p>
        </div>
        <SignIn
          appearance={{
            variables: {
              colorPrimary:         '#154212',
              colorBackground:      '#FFFFFF',
              colorText:            '#191C18',
              colorTextSecondary:   '#72796E',
              colorInputBackground: '#FFFFFF',
              colorInputText:       '#191C18',
              fontFamily:           'Inter, system-ui, sans-serif',
              borderRadius:         '8px',
            },
            elements: {
              card:              'shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#F3F4F6] rounded-xl',
              formButtonPrimary: 'bg-[#154212] hover:bg-[#2D5A27] text-white font-bold',
              formFieldInput:    'border-[#F3F4F6] focus:border-[#2D5A27]',
              footerActionLink:  'text-[#2D5A27] hover:text-[#154212]',
            },
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  )
}
