export type Constructor<Type = object> = new (...args: unknown[]) => Type;

export type ConstEnum<Type> = Type[keyof Type];

export type Tuple2<T> = [T, T];

export type Tuple3<T> = [T, T, T];

export type Tuple4<T> = [T, T, T, T];

export type Mutable<Type> = {
    -readonly [Key in keyof Type]: Type[Key];
};
