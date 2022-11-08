import EventEmitter from 'events';
import {
  CallOptions,
  Contract,
  ContractSendMethod,
  EventData,
} from 'web3-eth-contract';

export interface IWeb3Contract<M = null | unknown, E = null | unknown>
  extends Contract {
  methods: M;
  events: E;
}

export interface IWeb3ContractSendMethod<T = unknown>
  extends ContractSendMethod {
  call(
    options?: CallOptions,
    callback?: (error: Error, result: T) => void,
  ): Promise<T>;
}

export interface IEventData<T> extends EventData {
  returnValues: T;
}

export interface IWeb3ContractEvent<T> extends EventEmitter {
  on(eventName: 'connected', listener: (subscriptionId: string) => void): this;
  on(eventName: 'data', listener: (event: IEventData<T>) => void): this;
  on(eventName: 'error', listener: <E = Error>(error: E) => void): this;
  on(eventName: 'changed', listener: <C = unknown>(...args: C[]) => void): this;
}
