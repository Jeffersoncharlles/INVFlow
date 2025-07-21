const CreateStreamForm = () => {
  return (
    <Card className="h-full w-full bg-neutral-900">
      <CardHeader>
        <CardTitle>Add Streams</CardTitle>
        <CardDescription>your add streams here</CardDescription>
        <CardContent>
          <Form {...createStreamForm}>
            <form
              onSubmit={createStreamForm.handleSubmit(
                handleCreateStreamsSubmit
              )}
            >
              <FormField
                control={createStreamForm.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url Stream</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createStreamForm.control}
                name="streamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Stream</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createStreamForm.control}
                name="bitrate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bitrate</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createStreamForm.control}
                name="codec"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codecs</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="codec" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h264">h264</SelectItem>
                          <SelectItem value="h265">h265</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Criar Stream</Button>
            </form>
          </Form>
          {/* <div
                    key={`second-array-d_imo-2`}
                    className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-700"
                  ></div> */}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default CreateStreamForm;
