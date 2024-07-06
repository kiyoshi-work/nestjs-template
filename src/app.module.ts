import { Module } from '@nestjs/common';
import { ApiModule } from '@/api';
import { WorkerModule } from '@/worker/worker.module';

const isApi = Boolean(Number(process.env.IS_API || 0));
const isWorker = Boolean(Number(process.env.IS_WORKER || 0));

let _modules = [];
if (isApi) {
  _modules = [..._modules, ApiModule];
}
if (isWorker) {
  _modules = [..._modules, WorkerModule];
}
@Module({
  imports: [..._modules],
  controllers: [],
  providers: [],
})
export class AppModule {}
