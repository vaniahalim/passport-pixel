interface PassportHeaderProps {
  citiesCount: number;
  countriesCount: number;
}

const PassportHeader = ({ citiesCount, countriesCount }: PassportHeaderProps) => {
  return (
    <header className="bg-card pixel-border-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-bounce-pixel">✈️</div>
          <div>
            <h1 className="text-lg sm:text-xl font-pixel pixel-text-shadow text-foreground leading-relaxed">
              PASSPORT PIXEL
            </h1>
            <p className="font-retro text-xl text-muted-foreground mt-1">
              Your Digital Travel Log
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-pixel-green pixel-border-sm px-4 py-3 text-center">
            <div className="font-pixel text-lg text-primary-foreground">{citiesCount}</div>
            <div className="font-retro text-sm text-primary-foreground">CITIES</div>
          </div>
          <div className="bg-pixel-blue pixel-border-sm px-4 py-3 text-center">
            <div className="font-pixel text-lg text-secondary-foreground">{countriesCount}</div>
            <div className="font-retro text-sm text-secondary-foreground">COUNTRIES</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PassportHeader;
