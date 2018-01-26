export abstract class GlobalMembersService {
  private _isSpinnerVisible: boolean = true
  private _isSideNavVisible: boolean = false
  private _navBarColor: string = 'green'

  get isSideNavVisible(): boolean {
    return this._isSideNavVisible
  }

  get isSpinnerVisible(): boolean {
    return this._isSpinnerVisible
  }

  get navBarColor(): string {
    return this._navBarColor
  }

  showSideNav(): void {
    this._isSideNavVisible = true
  }

  hideSideNav(): void {
    this._isSideNavVisible = false
  }

  showSpinner(): void {
    this._isSpinnerVisible = true
  }

  hideSpinner(): void {
    this._isSpinnerVisible = false
  }
}