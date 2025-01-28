import { useState } from 'react';
import { ZentaraInput } from '@zentara/core';
import { emojiPlugin } from '@zentara/plugin-emoji';
import { templatePlugin } from '@zentara/plugin-template';

export default function App() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='bg-white shadow-sm rounded-lg p-6 space-y-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-8'>
              Zentara Input Examples
            </h1>

            <div className='space-y-6'>
              {/* 기본 사용 예시 */}
              <div>
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>
                  Basic Usage
                </h2>
                <ZentaraInput
                  value={value1}
                  onChange={setValue1}
                  placeholder='Type something...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <p className='mt-2 text-sm text-gray-500'>Value: {value1}</p>
              </div>

              {/* 이모지 플러그인 예시 */}
              <div>
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>
                  With Emoji Plugin
                </h2>
                <p className='text-sm text-gray-500 mb-2'>
                  Try typing ":" followed by text to search for emojis
                </p>
                <ZentaraInput
                  value={value2}
                  onChange={setValue2}
                  placeholder="Try typing ':happy'"
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  plugins={{
                    plugins: [emojiPlugin],
                    pluginConfigs: {
                      emoji: {
                        triggerChar: ':',
                        maxSuggestions: 5,
                      },
                    },
                  }}
                />
                <p className='mt-2 text-sm text-gray-500'>Value: {value2}</p>
              </div>

              {/* 템플릿 플러그인 예시 */}
              <div>
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>
                  With Template Plugin
                </h2>
                <p className='text-sm text-gray-500 mb-2'>
                  {`Try typing "{{." to access variables. Available variables: value1, value2.`}
                </p>
                <ZentaraInput
                  value={value3}
                  onChange={setValue3}
                  placeholder="Try typing '{{.'"
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  plugins={{
                    plugins: [templatePlugin],
                    pluginConfigs: {
                      'template-autocomplete': {
                        variables: ['name', 'age', 'email'],
                        triggerChar: '{{.',
                        maxSuggestions: 5,
                      },
                    },
                  }}
                />
                <p className='mt-2 text-sm text-gray-500'>Value: {value3}</p>
              </div>
            </div>
          </div>

          {/* 문서 링크 */}
          <div className='pt-6 border-t border-gray-200'>
            <p className='text-sm text-gray-500'>
              View more examples and documentation on{' '}
              <a
                href='https://github.com/yourusername/zentara'
                className='text-blue-500 hover:text-blue-600'
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
