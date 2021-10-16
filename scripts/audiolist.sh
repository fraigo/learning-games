find www/audio | grep -o -E en/.+ | sed s/.wav// | sed s#en/## > www/audio/audio.en.txt
find www/audio | grep -o -E es/.+ | sed s/.wav// | sed s#es/## > www/audio/audio.es.txt