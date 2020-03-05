import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabPortal from './TabPortal';

describe('TabPortal', () => {
  beforeAll(() => {
    // See: https://github.com/jsdom/jsdom/issues/1261
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      get() {
        return this.parentNode;
      }
    });
  });

  it('tabs forward in the expected order', () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>
    );
    expect(document.body).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('2')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('3')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('4')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('5')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('6')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('7')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('8')).toHaveFocus();
    userEvent.tab();
    // Focus should have looped around.
    expect(getByTestId('1')).toHaveFocus();
  });

  it('tabs backward in the expected order', () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="4" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="5" />
        <TabPortal.Content>
          <select data-testid="2">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="3">
            Click here
          </a>
        </TabPortal.Content>
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>
    );
    expect(document.body).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab({ shift: true });
    // Focus should have looped around.
    expect(getByTestId('8')).toHaveFocus();
  });

  it('skips over content when there are no tabbables', () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="2" />
        <button data-testid="6" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Content></TabPortal.Content>
        <input data-testid="4" />
        <a href="#" data-testid="5">
          Click here
        </a>
      </TabPortal>
    );
    expect(document.body).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('2')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('3')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('4')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('5')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('6')).toHaveFocus();
    userEvent.tab();
    // Focus should have looped around.
    expect(getByTestId('1')).toHaveFocus();
  });

  it('skips over content when there are no tabbables in reverse order', () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Portal />
        <button data-testid="2" />
        <button data-testid="6" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Content></TabPortal.Content>
        <input data-testid="4" />
        <a href="#" data-testid="5">
          Click here
        </a>
      </TabPortal>
    );
    expect(document.body).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab({ shift: true });
    // Focus should have looped around.
    expect(getByTestId('6')).toHaveFocus();
  });

  it('supports content coming before portal', () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Content>
          <select data-testid="4">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="5">
            Click here
          </a>
        </TabPortal.Content>
        <button data-testid="2" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Portal />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>
    );
    expect(document.body).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('2')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('3')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('4')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('5')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('6')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('7')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('8')).toHaveFocus();
    userEvent.tab();
    // Focus should have looped around.
    expect(getByTestId('1')).toHaveFocus();
  });

  it('supports content coming before portal when reverse tabbing', () => {
    const { getByTestId } = render(
      <TabPortal>
        <input data-testid="1" />
        <TabPortal.Content>
          <select data-testid="4">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <a href="#" data-testid="5">
            Click here
          </a>
        </TabPortal.Content>
        <button data-testid="2" />
        <button data-testid="8" tabIndex={1} />
        <button data-testid="3" />
        <TabPortal.Portal />
        <input data-testid="6" />
        <a href="#" data-testid="7">
          Click here
        </a>
      </TabPortal>
    );
    expect(document.body).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('8')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('7')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('6')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('5')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('4')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('3')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('2')).toHaveFocus();
    userEvent.tab({ shift: true });
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab({ shift: true });
    // Focus should have looped around.
    expect(getByTestId('8')).toHaveFocus();
  });

  it('forwards props and refs to TabPortal.Content', () => {
    const ref = React.createRef();

    const { getByTestId } = render(
      <TabPortal>
        <TabPortal.Portal />
        <button data-testid="2">Click me</button>
        <TabPortal.Content data-testid="content" ref={ref}>
          <input data-testid="1" />
        </TabPortal.Content>
      </TabPortal>
    );

    expect(document.body).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('2')).toHaveFocus();
    expect(ref.current).toBe(getByTestId('content'));
  });

  it('forwards function refs to TabPortal.Content', () => {
    const ref = jest.fn();

    const { getByTestId } = render(
      <TabPortal>
        <TabPortal.Portal />
        <button data-testid="2">Click me</button>
        <TabPortal.Content data-testid="content" ref={ref}>
          <input data-testid="1" />
        </TabPortal.Content>
      </TabPortal>
    );

    expect(document.body).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('1')).toHaveFocus();
    userEvent.tab();
    expect(getByTestId('2')).toHaveFocus();
    expect(ref).toHaveBeenCalledWith(getByTestId('content'));
  });
});
