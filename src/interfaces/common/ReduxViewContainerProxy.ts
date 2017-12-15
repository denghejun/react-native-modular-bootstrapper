import { ReduxViewContainer } from './ReduxViewContainer'

export class ReduxViewContainerProxy {
    public static create<TContainer extends ReduxViewContainer<React.Component>>(container: (new () => TContainer)) {
        return new container().create();
    }
}
