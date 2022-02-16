import { HttpcModule } from './httpc.module';
import { CommandFactory } from 'nest-commander';

async function startCommandLineApplication() {
  await CommandFactory.run(HttpcModule);
}

startCommandLineApplication();
