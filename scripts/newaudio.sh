if [ "$1" == "" ]; then
  echo "Usage: $0 expr folder"
  echo "Example: $0 hello /tmp"
fi
WORD=$1
TARGET=$2
FILE=$1
FILE=${FILE/á/a}
FILE=${FILE/é/e}
FILE=${FILE/í/i}
FILE=${FILE/ó/o}
FILE=${FILE/ú/u}
say -v paulina "$WORD" 
say -v paulina "$WORD" -o "$FILE"
ffmpeg -i "$FILE.aiff" "$FILE.wav"
rm -f "$FILE.aiff"
if [ ! "$2" == "" ]; then
  mv "$FILE.wav" $TARGET
fi