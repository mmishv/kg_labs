import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './labs/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
