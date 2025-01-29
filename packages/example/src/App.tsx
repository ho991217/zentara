import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SuggestionsPluginExample } from './components/SuggestionsPluginExample';
import { ThemeProvider } from './components/ThemeProvider';
import '@zentara/plugin-suggestions/dist/index.css';
import { Toaster } from './components/ui/toaster';
import { WithReactHookFormExample } from './components/WithReactHookFormExample';
import { FormInputIcon, StarIcon } from 'lucide-react';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <div className='h-screen w-screen flex justify-center items-center'>
        <Tabs defaultValue='suggestions' className='w-[1200px]'>
          <TabsList>
            <TabsTrigger
              value='suggestions'
              className='flex items-center gap-2'
            >
              <StarIcon className='size-3' /> Suggestions
            </TabsTrigger>
            <TabsTrigger value='hook-form' className='flex items-center gap-2'>
              <FormInputIcon className='size-3' /> Hook Form
            </TabsTrigger>
          </TabsList>
          <TabsContent value='suggestions'>
            <SuggestionsPluginExample />
          </TabsContent>
          <TabsContent value='hook-form'>
            <WithReactHookFormExample />
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  );
}

export default App;
