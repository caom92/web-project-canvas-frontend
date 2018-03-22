export abstract class GlobalMembersService {
  
  private _isSpinnerVisible = true
  private _isSideNavVisible = false

  constructor(private readonly _navBarColor: string = 'green') {
  }

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
