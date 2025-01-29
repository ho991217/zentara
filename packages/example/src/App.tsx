import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SuggestionsPluginExample } from './components/SuggestionsPluginExample';
import { ThemeProvider } from './components/ThemeProvider';
import '@zentara/plugin-suggestions/dist/index.css';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='h-screen w-screen'>
        <div className='flex flex-col items-center justify-center max-w-screen-4xl w-full mx-auto'>
          <Tabs defaultValue='suggestions' className=''>
            <TabsList>
              <TabsTrigger value='suggestions'>Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value='suggestions'>
              <SuggestionsPluginExample />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
