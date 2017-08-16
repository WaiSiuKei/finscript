const testsContext = (<any>require).context('.', true, /\.spec\.ts$/);
testsContext.keys().forEach(testsContext);
