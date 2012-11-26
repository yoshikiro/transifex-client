from flask import Flask, jsonify, render_template, request
import webbrowser
app = Flask(__name__)
from txclib.log import logger
from txclib import project


DEFAULT_FORMATS = {
    '.properties': 'PROPERTIES',
    '.xml': 'ANDROID',
    '.desktop': 'DESKTOP',
    '.dtd': 'DTD',
    '.strings': 'STRINGS',
    '.po': 'PO',
    '.pot': 'PO',
    
}

@app.route('/tx/home/')
def home(name=None):
    "Print status of current project"
    from txclib import get_version
    txc_version = get_version()

    prj = project.Project(path_to_tx)

    # Let's create a resource list from our config file
    res_list = []
    prev_proj = ''
    for idx, res in enumerate(prj.get_resource_list()):
        hostname = prj.get_resource_host(res)
        p, r = res.split('.')
        p_url = '%s/projects/p/%s' % (hostname, p)
        r_url = '%s/resource/%s' % (p_url, r)
        sfile = prj.get_resource_option(res, 'source_file') or "N/A"
        expr = prj.config.get(res, "file_filter").replace('<lang>', '<span class="lang">&lt;lang&gt;</span>')
        expr_highlight = expr.replace('<lang>', '<span class="lang">&lt;lang&gt;</span>')
        res_list.append({'id': res,
                         'p_name': p,
                         'p_changed': (res_list and p != res_list[-1]['p_name']),
                         'p_url': p_url,
                         'r_name': r,
                         'r_url': r_url,
                         'source_file': sfile,
                         'expr': expr,
                         'expr_highlight': expr_highlight})
    res_list = sorted(res_list)

    return render_template('home.html',
        res_list=res_list, txc_version=txc_version)

@app.route('/tx/_pull', methods=['GET', 'POST'])
def pull():

    resourceLink = request.form["resources"]
    resources = resourceLink.split("*//")
    prj = project.Project(path_to_tx)
    #resource = request.args.get('resource')
    logger.info(resources[-1])
    #prj.pull(resources=[resource], fetchall=True, skip=True)
    return jsonify(result="OK")


@app.route('/tx/_push', methods=['GET', 'POST'])
def push():
    resourceLink = request.form["resources"]
    resources = resourceLink.split("*//")
    logger.info("zaab")
    prj = project.Project(path_to_tx)
    try:
	    prj.push(resources=resources, source=True)
	    prj.push(resources=resources, skip=True, translations=True, source=False)
	    return "success"
    except: 
	    return "failed"
    

    
logger.info("Running web UI. Please navigate to http://localhost:5000/")
webbrowser.open("http://localhost:5000/tx/home", new=0)
