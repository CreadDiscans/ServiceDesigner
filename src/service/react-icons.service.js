import * as fa from 'react-icons/fa';
import * as io from 'react-icons/io';
import * as md from 'react-icons/md';
import * as ti from 'react-icons/ti';
import * as go from 'react-icons/go';
import * as fi from 'react-icons/fi';
import * as gi from 'react-icons/gi';
import * as wi from 'react-icons/wi';
import * as di from 'react-icons/di';

export class ReactIconsService {

    static lib = {
        fa,
        io,
        md,
        ti,
        go,
        fi,
        gi,
        wi,
        di
    }

    static get(key) {
        return ReactIconsService.lib[key]
    }
}