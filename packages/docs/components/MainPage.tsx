import { Link } from 'nextra-theme-docs';
import { Logo } from './Logo';
import { ExternalLink, Palette, Plug, Sliders, Zap } from 'lucide-react';

type MainPageProps = {
  lang: 'en' | 'ko';
};

export const MainPage = (props: MainPageProps) => {
  return (
    <main className='relative w-full h-full min-h-screen'>
      <div className='max-w-[1280px] mx-auto pt-20 pb-16'>
        <div className='max-w-2xl'>
          <div className='w-full flex flex-col gap-4 items-center justify-start'>
            <div className='mb-2'>
              <h1 className='text-6xl font-semibold'>
                Maximize flexibility for your input with{' '}
                <Logo className='inline-block' height={60} width={200} />
              </h1>
            </div>

            <div className=''>
              <p className='text-lg font-medium text-neutral-400'>
                {props.lang === 'en'
                  ? `Zentara is a platform that allows you to create a flexible
                input. Extendable, customizable, and easy to use.`
                  : 'Zentara는 확장 가능하고 사용자 정의 가능하며 사용하기 쉬운 유연한 입력을 만들 수 있는 인풋 컴포넌트입니다.'}
              </p>
            </div>

            <div className='w-full mt-2'>
              <div className='flex items-start gap-4'>
                <Link
                  href={`/${props.lang}/document/getting-started/installation`}
                  className='no-underline bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors duration-300 px-5 py-3 rounded-xl font-semibold'
                >
                  {props.lang === 'en' ? 'Get started' : '시작하기'}
                </Link>
                <a
                  target='_blank'
                  rel='noreferrer'
                  href='https://github.com/ho991217/zentara'
                  className='flex items-center gap-2 bg-transparent text-black dark:text-white border border-neutral-600 dark:border-neutral-300 hover:bg-neutral-400/10 dark:hover:bg-neutral-400/10 transition-colors duration-300 px-5 py-3 rounded-xl font-semibold'
                >
                  {props.lang === 'en' ? 'Go to GitHub' : 'GitHub로 이동'}
                  <ExternalLink className='size-4' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-[1280px] mx-auto grid grid-cols-4 gap-4 pt-20'>
        <div className='w-full bg-neutral-200/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl aspect-square p-8'>
          <Plug className='size-10' />
          <div className='flex flex-col gap-2 mt-6'>
            <h3 className='text-2xl font-semibold'>Plugin based</h3>
            <p className='text-lg text-neutral-400'>
              Zentara is a plugin-based extendable React input component.
            </p>
          </div>
        </div>
        <div className='w-full bg-neutral-200/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl aspect-square p-8'>
          <Palette className='size-10' />
          <div className='flex flex-col gap-2 mt-6'>
            <h3 className='text-2xl font-semibold'>Customizable styling</h3>
            <p className='text-lg text-neutral-400'>
              Zentara is a customizable React input component. You can easily
              customize the styling of the input.
            </p>
          </div>
        </div>
        <div className='w-full bg-neutral-200/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl aspect-square p-8'>
          <Sliders className='size-10' />
          <div className='flex flex-col gap-2 mt-6'>
            <h3 className='text-2xl font-semibold'>Do more with less</h3>
            <p className='text-lg text-neutral-400'>
              With Zentara, you can create a flexible input with less code.
            </p>
          </div>
        </div>
        <div className='w-full bg-neutral-200/80 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 rounded-3xl aspect-square p-8'>
          <Zap className='size-10' />
          <div className='flex flex-col gap-2 mt-6'>
            <h3 className='text-2xl font-semibold'>Lightweight</h3>
            <p className='text-lg text-neutral-400'>
              Zentara is ultra lightweight. It is only 1.5kb. (1.5kb with gzip)
            </p>
          </div>
        </div>
      </div>

      <div className='absolute inset-0 top-0 bottom-0 right-0 left-0 -z-50 bg-[repeating-linear-gradient(157.5deg,rgb(255,255,255)_0px,rgb(255,255,255)_10px,transparent_10px,transparent_11px),repeating-linear-gradient(67.5deg,rgb(255,255,255)_0px,rgb(255,255,255)_10px,transparent_10px,transparent_11px),linear-gradient(0deg,rgba(50,50,50,0.5),rgba(200,200,200,0.5))] dark:bg-[repeating-linear-gradient(157.5deg,rgb(0,0,0)_0px,rgb(0,0,0)_10px,transparent_10px,transparent_11px),repeating-linear-gradient(67.5deg,rgb(0,0,0)_0px,rgb(0,0,0)_10px,transparent_10px,transparent_11px),linear-gradient(0deg,rgba(200,200,200,0.5),rgba(50,50,50,0.5))]' />
    </main>
  );
};
