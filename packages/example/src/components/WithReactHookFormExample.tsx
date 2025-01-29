import { z } from 'zod';
import { StyledZentaraInput } from './StyledZentaraInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export const WithReactHookFormExample = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: 'Submitted',
      description: JSON.stringify(values),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Try typing:</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    {/* eeeasy as that! */}
                    <StyledZentaraInput {...field} />
                  </FormControl>
                  <FormDescription>
                    Try type some text under 2 characters and above 50
                    characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-16'>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
