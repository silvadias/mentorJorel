import {Env}    from './config/env';
import {App}    from './app';

App.listen(
  Env.port,() => {
    console.log(`Express server running on port${Env.port}`);
    console.log(`Node  environment mode is ${Env.nodeEnv}`);
  }
);