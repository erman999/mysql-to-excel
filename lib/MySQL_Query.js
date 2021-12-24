// SQL Query
module.exports = `
    SELECT
      kaynak.kaynakId,
      kaynak.uniqueCode AS kaynak_uniqueCode,
      kaynak.cycle,
      CAST(SUBSTRING_INDEX(kaynak.time, "s", 1) AS DECIMAL(10,2)) AS 'time(s)',
      CAST(SUBSTRING_INDEX(kaynak.power, "w", 1) AS DECIMAL(10)) AS 'power(w)',
      CAST(SUBSTRING_INDEX(kaynak.energy, "j", 1) AS DECIMAL(10)) AS 'energy(j)',
      CAST(SUBSTRING_INDEX(kaynak.height, "mm", 1) AS DECIMAL(10,2)) AS 'height(mm)',
      CAST(SUBSTRING_INDEX(kaynak.travel, "mm", 1) AS DECIMAL(10,2)) AS 'travel(mm)',
      CAST(kaynak.speed AS DECIMAL(10)) AS 'speed',
      kaynak.hour,
      kaynak.createDate AS kaynak_createDate,
      tbl_sicak.*,
      tbl_ateq.*,
      tbl_soguk.*
    FROM sm016.kaynak AS kaynak
    LEFT JOIN (SELECT *,
               flowTestResult AS sicak_flowTestResult,
               paramFlowMin AS sicak_paramFlowMin,
               paramFlowMax AS sicak_paramFlowMax,
               createDate AS sicak_createDate
               FROM sm016.sicaktest
               ORDER BY sicakTestId DESC) AS tbl_sicak
               ON kaynak.uniqueCode = tbl_sicak.uniqueCode
    LEFT JOIN (SELECT *,
               createDate AS ateq_createDate
               FROM sm016.ateqtest
               ORDER BY ateqTestId DESC) AS tbl_ateq
               ON kaynak.uniqueCode = tbl_ateq.uniqueCode
    LEFT JOIN (SELECT *,
               flowTestResult AS soguk_flowTestResult,
               paramFlowMin AS soguk_paramFlowMin,
               paramFlowMax AS soguk_paramFlowMax,
               createDate AS soguk_createDate
               FROM sm016.soguktest
               ORDER BY sogukTestId DESC) AS tbl_soguk
               ON kaynak.uniqueCode = tbl_soguk.uniqueCode
    ORDER BY sm016.kaynak.kaynakId DESC;`;
