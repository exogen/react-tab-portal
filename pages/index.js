import React from 'react';
import { TabPortal } from '../src';

export default function HomePage() {
  return (
    <main>
      {
        <TabPortal>
          <div>
            <input placeholder="Foo" />
            <TabPortal.Portal />
            <button>Click me foo</button>
            <button>Click me bar</button>
          </div>
          <TabPortal.Content>
            <div style={{ padding: 5 }}>
              <select>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>{' '}
              <select>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>{' '}
              &larr; This should come in between the top input and buttons in
              the tab order, even though it’s after the buttons in the document
              order!
            </div>
          </TabPortal.Content>
          <input placeholder="Bar" />
        </TabPortal>
      }
      {
        <TabPortal>
          <div>
            <TabPortal.Content>
              <div style={{ padding: 5 }}>
                <select>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>{' '}
                &larr; This should come in between the two buttons below, even
                though it comes before all remaining elements in the document
                order!
              </div>
            </TabPortal.Content>
            <input placeholder="Foo" />
            <button>Click me foo</button>
            <TabPortal.Portal />
            <button>Click me bar</button>
          </div>
          <input placeholder="Bar" />
        </TabPortal>
      }
    </main>
  );
}
