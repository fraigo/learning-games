if [ "$1" == "" ]; then
  echo "Usage: $0 expr folder"
  echo "Example: $0 hello /tmp"
fi
WORD=$1
TARGET=$2
say -v paulina "$WORD" 
say -v paulina "$WORD" -o "$WORD"
ffmpeg -i "$WORD.aiff" "$WORD.wav"
rm -f "$f.aiff"
if [ ! "$2" == "" ]; then
  mv "$WORD.wav" $TARGET
fi