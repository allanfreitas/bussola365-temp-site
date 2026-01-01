export interface DomainEvent<T = unknown> {
    name: string;
    data: T;
}

export interface EventBus {
    publish(events: DomainEvent[]): Promise<void>;
}