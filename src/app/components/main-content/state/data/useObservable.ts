import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { useEffect, useState } from "react";

// const api = `https://randomuser.me/api/?results=5&seed=rx-react&nat=us&inc=name&noinfo`;
// const getName = (user) => `${user.name.first} ${user.name.last}`;
// const names$ = ajax.getJSON(api).pipe(map(({ results: users }) => users.map(getName)));

export default function useObservable(observable$: Observable<any>) {
  const [state, setState] = useState();

  useEffect(() => {
    const sub = observable$.subscribe(setState);

    return () => sub.unsubscribe();
  }, [observable$]);

  return state;
}
